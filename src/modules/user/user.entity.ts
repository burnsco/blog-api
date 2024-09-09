import { Entity, Property, TextType } from '@mikro-orm/core';
import { BaseEntity } from '../common/base.entity.js';

@Entity()
export class User extends BaseEntity {

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property()
	username!: string;

	@Property()
	email!: string;

	@Property()
	password!: string;

	@Property({ type: TextType })
	bio = '';

}
