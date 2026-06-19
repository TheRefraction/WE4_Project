/**
 * base.model.ts
 */

export interface BaseEntity {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}