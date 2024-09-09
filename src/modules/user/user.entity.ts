import { Collection, Entity, OneToMany, Property, TextType } from '@mikro-orm/core';
import crypto from 'crypto';
import type { Article } from '../article/article.entity.ts';
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

	// hidden serializes, lazy means it wont be selected auto
	@Property({ hidden: true, lazy: true })
	password!: string;

	@Property({ type: TextType })
	bio = '';

	@OneToMany({ mappedBy: 'author' })
	articles = new Collection<Article>(this)

	constructor(username: string, email: string, password: string) {
		super();
		this.username = username;
		this.email = email;
		this.password = User.hashPassword(password);
	}

	static hashPassword(password: string) {
		return crypto.createHmac('sha256', password).digest('hex');
	}

}
