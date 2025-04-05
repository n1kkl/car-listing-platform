import { Migration } from '@mikro-orm/migrations';

export class Migration20250405123939 extends Migration {
  override up(): void {
    this.addSql(
      `create table "profile"
       (
           "id"           varchar(255) not null,
           "created_at"   timestamptz  not null,
           "updated_at"   timestamptz  not null,
           "display_name" varchar(255) not null,
           "keycloak_id"  varchar(255) not null,
           constraint "profile_pkey" primary key ("id")
       );`,
    );

    this.addSql(
      `create table "listing"
       (
           "id"          varchar(255) not null,
           "created_at"  timestamptz  not null,
           "updated_at"  timestamptz  not null,
           "owner_id"    varchar(255) not null,
           "is_draft"    boolean      not null,
           "title"       text         not null,
           "description" text         not null,
           "price"       int          not null,
           constraint "listing_pkey" primary key ("id")
       );`,
    );

    this.addSql(`alter table "listing"
        add constraint "listing_owner_id_foreign" foreign key ("owner_id") references "profile" ("id") on update cascade;`);
  }

  override down(): void {
    this.addSql(
      `alter table "listing" drop constraint "listing_owner_id_foreign";`,
    );

    this.addSql(`drop table if exists "profile" cascade;`);

    this.addSql(`drop table if exists "listing" cascade;`);
  }
}
