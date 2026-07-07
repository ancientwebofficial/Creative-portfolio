const { createClient } = require("@supabase/supabase-js");

const url = "https://jgfoandvdeuyslqrqjwb.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZm9hbmR2ZGV1eXNscXJxandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjAyNjksImV4cCI6MjA5NTY5NjI2OX0.2RR3NpzBcBCP-rum9WdGhnehWJystrcUcA2ZcxaKYaQ";

const supabase = createClient(url, anonKey);

async function testDB() {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("id, title, thumbnail_url, gallery_images, visibility")
    .eq("visibility", "public")
    .limit(10);

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Portfolio items:", JSON.stringify(data, null, 2));
  }
}

testDB();
