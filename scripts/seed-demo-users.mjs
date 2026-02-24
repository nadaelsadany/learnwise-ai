/**
 * seed-demo-users.mjs
 * Run once to create all 4 demo accounts in Supabase.
 *
 * Usage:
 *   node scripts/seed-demo-users.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>
 *
 * Find these in: Supabase Dashboard → Project Settings → API
 *   - Project URL     → SUPABASE_URL
 *   - service_role key (secret) → SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const [, , SUPABASE_URL, SERVICE_ROLE_KEY] = process.argv;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Usage: node scripts/seed-demo-users.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_USERS = [
    { email: "student@demo.com", password: "demo1234", role: "applicant", fullName: "Demo Student" },
    { email: "instructor@demo.com", password: "demo1234", role: "instructor", fullName: "Demo Instructor" },
    { email: "university@demo.com", password: "demo1234", role: "university", fullName: "Demo University" },
    { email: "admin@demo.com", password: "demo1234", role: "admin", fullName: "Demo Admin" },
];

async function seed() {
    console.log("🌱 Seeding demo users...\n");

    for (const u of DEMO_USERS) {
        process.stdout.write(`  Creating ${u.email} (${u.role})... `);

        // 1. Create auth user
        const { data, error } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,       // no email confirmation needed
            user_metadata: { full_name: u.fullName },
        });

        if (error) {
            if (error.message.includes("already been registered")) {
                console.log("⚠️  already exists, skipping");
            } else {
                console.log("❌ error:", error.message);
            }
            continue;
        }

        const userId = data.user.id;

        // 2. Insert profile
        await supabase.from("profiles").upsert({
            user_id: userId,
            full_name: u.fullName,
        }, { onConflict: "user_id" });

        // 3. Insert role
        const { error: roleError } = await supabase.from("user_roles").upsert({
            user_id: userId,
            role: u.role,
        }, { onConflict: "user_id" });

        if (roleError) {
            console.log("⚠️  user created but role failed:", roleError.message);
        } else {
            console.log("✅ done");
        }
    }

    console.log("\n✅ Seeding complete! Demo credentials:");
    console.log("   Email pattern: <role>@demo.com");
    console.log("   Password:      demo1234");
}

seed().catch(console.error);
