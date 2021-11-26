import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxabzrnzazunvkshxgem.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjc4OTg2MCwiZXhwIjoxOTUyMzY1ODYwfQ.QKE-5Uvb80oz5JsE9fE9KTfx6TlfgqUpMhJE9Hmp0fE'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase