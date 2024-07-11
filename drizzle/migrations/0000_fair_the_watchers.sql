CREATE TABLE IF NOT EXISTS "eventos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar(50) NOT NULL,
	"inicio" timestamp with time zone NOT NULL,
	"fin" timestamp with time zone NOT NULL,
	"backcolor" varchar(50),
	"bordercolor" varchar(50)
);
