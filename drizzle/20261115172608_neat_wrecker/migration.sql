CREATE TABLE "todo" (
	"id" varchar(26) PRIMARY KEY,
	"task" varchar(255) NOT NULL,
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
