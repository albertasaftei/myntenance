"use server"
import { createClient } from "@/lib/supabase/server"
import { ProfileUpdate, SettingsUpdate } from "@/lib/supabase/types"
import { getCurrentUserId } from "@/lib/supabase/utils"

export async function getOwnSettings() {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)

  return supabase.from("user_settings").select("*").eq("user", userId!).single()
}

// TODO Can be done in one pass only with a db function
export async function updateOwnSettings(
  settings: SettingsUpdate,
  profile: ProfileUpdate,
) {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)

  const { error } = await supabase
    .from("user_settings")
    .update({ ...settings })
    .eq("user", userId!)

  if (error) {
    return { error }
  }

  console.log(profile)

  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({ ...profile })
    .eq("user", userId!)

  console.log(profileError)

  return { error: profileError }
}
