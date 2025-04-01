import { Migration } from '@mikro-orm/migrations';

export class Migration20250401162713 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "profile_entity" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "username" varchar(255) not null, constraint "profile_entity_pkey" primary key ("id"));`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "profile_entity" cascade;`);
  }
}
