import { ObjectId } from 'mongodb';

export const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id);
};

export const toObjectId = (id: string): ObjectId => {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new ObjectId(id);
};

export const toObjectIdArray = (ids: string[]): ObjectId[] => {
  return ids.map(id => toObjectId(id));
};