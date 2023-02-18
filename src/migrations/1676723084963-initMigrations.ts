import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMigrations1676723084963 implements MigrationInterface {
  name = 'initMigrations1676723084963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist" DROP CONSTRAINT "FK_206394ec532b4eb7748b0700a30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_3fe48e88867570a3509868a7645"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ALTER COLUMN "id" SET DEFAULT '2ae05fda-309f-4df0-873c-54987ea6f4a4'`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_3fe48e88867570a3509868a7645" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist" ADD CONSTRAINT "FK_206394ec532b4eb7748b0700a30" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist" DROP CONSTRAINT "FK_206394ec532b4eb7748b0700a30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_3fe48e88867570a3509868a7645"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ALTER COLUMN "id" SET DEFAULT '6471c7cd-e67c-418f-b2b6-a70de568dcff'`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_3fe48e88867570a3509868a7645" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "artist" ADD CONSTRAINT "FK_206394ec532b4eb7748b0700a30" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_4073bbe6e9014b79c8acf27ab45" FOREIGN KEY ("favoriteId") REFERENCES "favorites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
