import { MigrationInterface, QueryRunner } from "typeorm";

export class initMigrations1677519035462 implements MigrationInterface {
    name = 'initMigrations1677519035462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "artist_id" uuid, "album_id" uuid, "duration" integer NOT NULL, "favoriteId" character varying, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" character varying NOT NULL DEFAULT '6a9bac49-cf68-47e6-b617-c7b9a3a105fe', CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL DEFAULT false, "favoriteId" character varying, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artist_id" uuid, "favoriteId" character varying, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "hashedRefresh" character varying NOT NULL DEFAULT '', "version" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_ee355f43e4481bb45755c50e984" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_5902805b5cdc8b4fcf983f7df52" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_3fe48e88867570a3509868a7645" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_206394ec532b4eb7748b0700a30" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_ecbc0c0cfffc519f7f2407b0465" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45"`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_ecbc0c0cfffc519f7f2407b0465"`);
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_206394ec532b4eb7748b0700a30"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_3fe48e88867570a3509868a7645"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_5902805b5cdc8b4fcf983f7df52"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_ee355f43e4481bb45755c50e984"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "track"`);
    }

}
