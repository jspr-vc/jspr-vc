ALTER TABLE "accounts" RENAME TO "auth_accounts";--> statement-breakpoint
ALTER TABLE "sessions" RENAME TO "auth_sessions";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "auth_users";--> statement-breakpoint
ALTER TABLE "verificationTokens" RENAME TO "auth_verificationTokens";--> statement-breakpoint
ALTER TABLE "uploads" RENAME TO "auth_uploads";--> statement-breakpoint
ALTER TABLE "experiences" RENAME TO "profile_experiences";--> statement-breakpoint
ALTER TABLE "experience_technologies" RENAME TO "profile_experience_technologies";--> statement-breakpoint
ALTER TABLE "technologies" RENAME TO "profile_technologies";--> statement-breakpoint
ALTER TABLE "portfolios" RENAME TO "profile_portfolios";--> statement-breakpoint
ALTER TABLE "projects" RENAME TO "profile_projects";--> statement-breakpoint
ALTER TABLE "project_technologies" RENAME TO "profile_project_technologies";--> statement-breakpoint
ALTER TABLE "posts" RENAME TO "profile_posts";--> statement-breakpoint
ALTER TABLE "auth_uploads" DROP CONSTRAINT "uploads_key_unique";--> statement-breakpoint
ALTER TABLE "profile_technologies" DROP CONSTRAINT "technologies_slug_unique";--> statement-breakpoint
ALTER TABLE "profile_portfolios" DROP CONSTRAINT "portfolios_slug_unique";--> statement-breakpoint
ALTER TABLE "profile_projects" DROP CONSTRAINT "projects_slug_unique";--> statement-breakpoint
ALTER TABLE "profile_posts" DROP CONSTRAINT "posts_slug_unique";--> statement-breakpoint
ALTER TABLE "auth_accounts" DROP CONSTRAINT "accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "auth_sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "auth_uploads" DROP CONSTRAINT "uploads_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_experiences" DROP CONSTRAINT "experiences_portfolio_id_portfolios_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_experience_technologies" DROP CONSTRAINT "experience_technologies_experience_id_experiences_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_experience_technologies" DROP CONSTRAINT "experience_technologies_technology_id_technologies_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_portfolios" DROP CONSTRAINT "portfolios_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_projects" DROP CONSTRAINT "projects_portfolio_id_portfolios_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_project_technologies" DROP CONSTRAINT "project_technologies_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_project_technologies" DROP CONSTRAINT "project_technologies_technology_id_technologies_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_posts" DROP CONSTRAINT "posts_author_id_portfolios_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_userId_auth_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_userId_auth_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_uploads" ADD CONSTRAINT "auth_uploads_owner_id_auth_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "auth_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_experiences" ADD CONSTRAINT "profile_experiences_portfolio_id_profile_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "profile_portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_experience_technologies" ADD CONSTRAINT "profile_experience_technologies_experience_id_profile_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "profile_experiences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_experience_technologies" ADD CONSTRAINT "profile_experience_technologies_technology_id_profile_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "profile_technologies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_portfolios" ADD CONSTRAINT "profile_portfolios_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_projects" ADD CONSTRAINT "profile_projects_portfolio_id_profile_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "profile_portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_project_technologies" ADD CONSTRAINT "profile_project_technologies_project_id_profile_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "profile_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_project_technologies" ADD CONSTRAINT "profile_project_technologies_technology_id_profile_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "profile_technologies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_posts" ADD CONSTRAINT "profile_posts_author_id_profile_portfolios_id_fk" FOREIGN KEY ("author_id") REFERENCES "profile_portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "auth_uploads" ADD CONSTRAINT "auth_uploads_key_unique" UNIQUE("key");--> statement-breakpoint
ALTER TABLE "profile_technologies" ADD CONSTRAINT "profile_technologies_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "profile_portfolios" ADD CONSTRAINT "profile_portfolios_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "profile_projects" ADD CONSTRAINT "profile_projects_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "profile_posts" ADD CONSTRAINT "profile_posts_slug_unique" UNIQUE("slug");