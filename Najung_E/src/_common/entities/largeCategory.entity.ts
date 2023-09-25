import { MiddleCategory } from 'src/_common/entities/middleCategory.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LargeCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToMany(() => MiddleCategory, (middleCategory) => middleCategory.largeCategory, {
    cascade: true,
  })
  middleCategories: LargeCategory[];

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
