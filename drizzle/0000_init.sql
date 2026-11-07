CREATE TABLE "forecasts" (
	"question_id" text NOT NULL,
	"voice" text NOT NULL,
	"p" double precision NOT NULL,
	"captured_at" timestamp with time zone NOT NULL,
	CONSTRAINT "forecasts_question_id_voice_pk" PRIMARY KEY("question_id","voice"),
	CONSTRAINT "forecasts_voice_check" CHECK ("forecasts"."voice" in ('deepbook', 'polymarket', 'kalshi', 'crowd')),
	CONSTRAINT "forecasts_p_check" CHECK ("forecasts"."p" > 0 and "forecasts"."p" < 1)
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"text" text NOT NULL,
	"memory_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"namespace" text NOT NULL,
	"kind" text NOT NULL,
	"ref" text NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"blob_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"written_at" timestamp with time zone,
	CONSTRAINT "memories_kind_check" CHECK ("memories"."kind" in ('record', 'scoreboard', 'lesson')),
	CONSTRAINT "memories_status_check" CHECK ("memories"."status" in ('pending', 'done', 'failed'))
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"digest" text PRIMARY KEY NOT NULL,
	"payer" text NOT NULL,
	"amount" bigint NOT NULL,
	"category" text NOT NULL,
	"status" text DEFAULT 'settling' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"settled_at" timestamp with time zone,
	CONSTRAINT "payments_status_check" CHECK ("payments"."status" in ('settling', 'settled', 'failed'))
);
--> statement-breakpoint
CREATE TABLE "picks" (
	"question_id" text NOT NULL,
	"visitor_id" text NOT NULL,
	"p" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "picks_question_id_visitor_id_pk" PRIMARY KEY("question_id","visitor_id"),
	CONSTRAINT "picks_p_check" CHECK ("picks"."p" > 0 and "picks"."p" < 1)
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"expiry" timestamp with time zone NOT NULL,
	"lock_at" timestamp with time zone NOT NULL,
	"strike" double precision,
	"state" text DEFAULT 'open' NOT NULL,
	"outcome" smallint,
	"split" boolean DEFAULT false NOT NULL,
	"venue_results" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "questions_category_check" CHECK ("questions"."category" in ('btc-5m', 'btc-15m')),
	CONSTRAINT "questions_state_check" CHECK ("questions"."state" in ('open', 'locked', 'resolved', 'void'))
);
--> statement-breakpoint
CREATE TABLE "scoreboard" (
	"category" text NOT NULL,
	"voice" text NOT NULL,
	"loss" double precision NOT NULL,
	"count" double precision NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scoreboard_category_voice_pk" PRIMARY KEY("category","voice")
);
--> statement-breakpoint
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_memory_id_memories_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."memories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "picks" ADD CONSTRAINT "picks_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "memories_status_created_idx" ON "memories" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "questions_state_lock_idx" ON "questions" USING btree ("state","lock_at");--> statement-breakpoint
CREATE INDEX "questions_state_expiry_idx" ON "questions" USING btree ("state","expiry");