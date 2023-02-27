import { MigrationInterface, QueryRunner } from "typeorm";

export class initMigrations1677517387293 implements MigrationInterface {
    name = 'initMigrations1677517387293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_3fe48e88867570a3509868a7645"`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45"`);
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_206394ec532b4eb7748b0700a30"`);
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "id" SET DEFAULT 'd2fa2d2f-3733-45a4-ad99-83f6944447ce'`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_3fe48e88867570a3509868a7645" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_206394ec532b4eb7748b0700a30" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_206394ec532b4eb7748b0700a30"`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_3fe48e88867570a3509868a7645"`);
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "id" SET DEFAULT '93d515ce-d5b9-4808-af98-12675634e471'`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_206394ec532b4eb7748b0700a30" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_3fe48e88867570a3509868a7645" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
