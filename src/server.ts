import { LoadStrategy, MikroORM } from '@mikro-orm/sqlite'; // or any other driver package
import { Article } from './modules/article/article.entity.js';
import { User } from './modules/user/user.entity.js';


async function main() {
	// initialize the ORM, loading the config file dynamically
	const orm = await MikroORM.init();

	// recreate the database schema
	await orm.schema.refreshDatabase();

	// create new user entity instance via constructor
	const user = new User(
		'cburns',
		'corey@gmail.com',
		'123456'
	);

	// fork first to have a separate context
	const em = orm.em.fork();

	// first mark the entity with `persist()`, then `flush()`
	await em.persist(user).flush();

	// clear the context to simulate fresh request
	em.clear();

	// create the article instance
	const article = em.create(Article, {
		title: 'Foo is Bar',
		text: 'Lorem impsum dolor sit amet',
		author: user.id,
	});
	console.log(article);



	// `em.create` calls `em.persist` automatically, so flush is enough
	await em.flush();

	// clear the context to simulate fresh request
	em.clear();

	// find article by id and populate its author
	const articleWithAuthor = await em.findOne(Article, article.id, {
		populate: ['author', 'text'],
		strategy: LoadStrategy.JOINED,
	});
	console.log(articleWithAuthor);


	// close the ORM, otherwise the process would keep going indefinitely
	await orm.close();

}

main()
