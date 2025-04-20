import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class Base extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'uuid', unique: true, default: () =>'UUID()'})
    uid: string;

    @Column({default: 0})
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}