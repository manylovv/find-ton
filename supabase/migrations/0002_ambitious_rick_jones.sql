CREATE TABLE "users" (
	"first_name" varchar(255),
	"id" integer PRIMARY KEY NOT NULL,
	"is_premium" boolean DEFAULT false,
	"language_code" varchar(255),
	"last_name" varchar(255),
	"photo_url" varchar(255),
	"username" varchar(255)
);
