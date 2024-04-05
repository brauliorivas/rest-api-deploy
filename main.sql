drop database if exists moviesdb;
create database if not exists moviesdb;

use moviesdb;

create table movie (
	id binary(16) primary key default (uuid_to_bin(uuid())),
    title varchar(255) not null,
    year int not null,
    director varchar(255) not null,
    duration int not null,
    poster text,
    rate decimal(3,1) not null
);

create table genre(
	id int auto_increment primary key,
    name varchar(255) not null unique
);

create table movie_genre (
	movie_id binary(16) references movie(id),
    genre_id int references genre(id),
    primary key (movie_id, genre_id)
);

insert into genre (name) values 
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Romance');

insert into movie (id, title, year, director, duration, poster, rate) values
(uuid_to_bin(uuid()), 'Inception', 2010, 'Christopher Nolan', 180, 'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
(uuid_to_bin(uuid()), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
(uuid_to_bin(uuid()), 'The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0);

insert into movie_genre (movie_id, genre_id)
values
((select id from movie where title = 'Inception'), (select id from genre where name = 'Sci-Fi')),
((select id from movie where title = 'Inception'), (select id from genre where name = 'Action')),
((select id from movie where title = 'The Shawshank Redemption'), (select id from genre where name = 'Drama')),
((select id from movie where title = 'The Dark Knight'), (select id from genre where name = 'Action'));

select *, bin_to_uuid(id) from movie;

select title, year, director, duration, poster, rate, bin_to_uuid(movie.id) as id from movie
inner join movie_genre
on movie.id = movie_genre.movie_id
inner join genre
on genre.id = movie_genre.genre_id
where lower(genre.name) = 'action';

select uuid();