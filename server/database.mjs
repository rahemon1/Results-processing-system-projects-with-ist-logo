import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readdirSync,readFileSync,chmodSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
export function openDatabase(filename,migrations){
 mkdirSync(dirname(filename),{recursive:true,mode:0o700});const sqlite=new DatabaseSync(filename);
 sqlite.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
 sqlite.exec('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');
 for(const name of readdirSync(migrations).filter(n=>n.endsWith('.sql')).sort()){
  if(sqlite.prepare('SELECT name FROM schema_migrations WHERE name=?').get(name))continue;
  sqlite.exec('BEGIN IMMEDIATE');try{sqlite.exec(readFileSync(resolve(migrations,name),'utf8'));sqlite.prepare('INSERT INTO schema_migrations (name,applied_at) VALUES (?,?)').run(name,new Date().toISOString());sqlite.exec('COMMIT');}catch(e){sqlite.exec('ROLLBACK');throw e;}
 }
 try{chmodSync(filename,0o600);}catch{}
 return {prepare(query){let args=[];const statement=sqlite.prepare(query);return {bind(...values){args=values;return this;},async first(){return statement.get(...args)??null;},async all(){return {results:statement.all(...args)};},_execute(){const r=statement.run(...args);return {success:true,meta:{changes:Number(r.changes)}};},async run(){return this._execute();}};},async batch(statements){sqlite.exec('BEGIN IMMEDIATE');try{const values=statements.map(s=>s._execute());sqlite.exec('COMMIT');return values;}catch(e){sqlite.exec('ROLLBACK');throw e;}},close(){sqlite.close();}};
}
