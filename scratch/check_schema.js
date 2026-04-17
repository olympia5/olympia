import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kdpgexrtqofstjipicus.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcGdleHJ0cW9mc3RqaXBpY3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzYxNDQsImV4cCI6MjA5MTc1MjE0NH0.qfKJQlT9e8gbvSuxzQLMVLA8UnyJlGtcdu_rusrozyU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  const { data, error } = await supabase
    .from('gym_settings')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Columns:', Object.keys(data))
  }
}

checkSchema()
