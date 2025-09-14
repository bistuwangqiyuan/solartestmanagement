export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string
          device_address: number
          device_type: string
          device_name: string
          status: 'active' | 'inactive' | 'maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          device_address: number
          device_type: string
          device_name: string
          status?: 'active' | 'inactive' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          device_address?: number
          device_type?: string
          device_name?: string
          status?: 'active' | 'inactive' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      experiments: {
        Row: {
          id: string
          name: string
          description: string | null
          start_time: string
          end_time: string | null
          operator: string
          status: 'running' | 'completed' | 'failed'
          parameters: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          operator: string
          status?: 'running' | 'completed' | 'failed'
          parameters?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          operator?: string
          status?: 'running' | 'completed' | 'failed'
          parameters?: Json
          created_at?: string
        }
      }
      experiment_data: {
        Row: {
          id: string
          device_id: string
          sequence_number: number
          current: number
          voltage: number
          power: number
          timestamp: string
          experiment_id: string
          created_at: string
        }
        Insert: {
          id?: string
          device_id: string
          sequence_number: number
          current: number
          voltage: number
          power: number
          timestamp: string
          experiment_id: string
          created_at?: string
        }
        Update: {
          id?: string
          device_id?: string
          sequence_number?: number
          current?: number
          voltage?: number
          power?: number
          timestamp?: string
          experiment_id?: string
          created_at?: string
        }
      }
      data_files: {
        Row: {
          id: string
          filename: string
          file_type: string
          file_size: number
          storage_url: string
          experiment_id: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          file_type: string
          file_size: number
          storage_url: string
          experiment_id: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          file_type?: string
          file_size?: number
          storage_url?: string
          experiment_id?: string
          uploaded_by?: string
          created_at?: string
        }
      }
      simulation_configs: {
        Row: {
          id: string
          name: string
          waveform_type: 'sine' | 'square' | 'triangle' | 'pwm'
          frequency: number
          amplitude: number
          phase: number
          duty_cycle: number | null
          parameters: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          waveform_type: 'sine' | 'square' | 'triangle' | 'pwm'
          frequency: number
          amplitude: number
          phase: number
          duty_cycle?: number | null
          parameters?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          waveform_type?: 'sine' | 'square' | 'triangle' | 'pwm'
          frequency?: number
          amplitude?: number
          phase?: number
          duty_cycle?: number | null
          parameters?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}