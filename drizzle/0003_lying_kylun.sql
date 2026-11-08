CREATE TABLE "amnesia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"before" integer NOT NULL,
	"restored" integer NOT NULL,
	"windows" integer NOT NULL,
	"lessons" integer NOT NULL,
	"max_difference" double precision NOT NULL,
	"identical" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "amnesia" ENABLE ROW LEVEL SECURITY;