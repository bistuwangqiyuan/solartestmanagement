export interface TestRecord {
  id: string
  test_date: string
  voltage: number | null
  current: number | null
  power: number | null
  device_address: number | null
  device_type: string | null
  batch_id: string | null
  import_id: string | null
  test_duration: number | null
  test_result: string | null
  notes: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export interface ImportBatch {
  id: string
  file_name: string
  file_size: number | null
  import_date: string
  record_count: number
  success_count: number
  error_count: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_details: Record<string, any> | null
  user_id: string | null
  created_at: string
}

export interface Device {
  id: string
  device_address: number
  device_name: string
  device_type: string | null
  manufacturer: string | null
  model: string | null
  serial_number: string | null
  calibration_date: string | null
  next_calibration_date: string | null
  status: 'active' | 'inactive' | 'maintenance'
  location: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AnalysisResult {
  id: string
  analysis_date: string
  analysis_type: 'daily' | 'weekly' | 'monthly' | 'custom'
  date_range_start: string | null
  date_range_end: string | null
  parameters: Record<string, any> | null
  results: Record<string, any> | null
  summary: Record<string, any> | null
  created_by: string | null
  created_at: string
}

export interface Alert {
  id: string
  rule_id: string
  alert_time: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string | null
  data: Record<string, any> | null
  acknowledged: boolean
  acknowledged_by: string | null
  acknowledged_at: string | null
  resolved: boolean
  resolved_at: string | null
  created_at: string
}

export interface SystemConfig {
  id: string
  config_key: string
  config_value: Record<string, any>
  description: string | null
  created_at: string
  updated_at: string
}

export interface DailyStatistics {
  test_day: string
  total_tests: number
  passed_tests: number
  failed_tests: number
  pass_rate: number
  avg_voltage: number
  avg_current: number
  avg_power: number
  min_power: number
  max_power: number
}