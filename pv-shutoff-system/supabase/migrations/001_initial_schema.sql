-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create devices table
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    device_address INTEGER NOT NULL,
    device_type VARCHAR(255) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create experiments table
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    operator VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
    parameters JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create experiment_data table
CREATE TABLE IF NOT EXISTS public.experiment_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL,
    current DECIMAL(10, 5) NOT NULL,
    voltage DECIMAL(10, 5) NOT NULL,
    power DECIMAL(10, 5) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create data_files table
CREATE TABLE IF NOT EXISTS public.data_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    storage_url TEXT NOT NULL,
    experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create simulation_configs table
CREATE TABLE IF NOT EXISTS public.simulation_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    waveform_type VARCHAR(50) CHECK (waveform_type IN ('sine', 'square', 'triangle', 'pwm')) NOT NULL,
    frequency DECIMAL(10, 3) NOT NULL,
    amplitude DECIMAL(10, 3) NOT NULL,
    phase DECIMAL(10, 3) NOT NULL DEFAULT 0,
    duty_cycle DECIMAL(5, 2),
    parameters JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_experiment_data_experiment_id ON public.experiment_data(experiment_id);
CREATE INDEX idx_experiment_data_device_id ON public.experiment_data(device_id);
CREATE INDEX idx_experiment_data_timestamp ON public.experiment_data(timestamp);
CREATE INDEX idx_data_files_experiment_id ON public.data_files(experiment_id);
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_experiments_status ON public.experiments(status);

-- Create update trigger for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_configs ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all authenticated users full access)
-- In production, these should be more restrictive
CREATE POLICY "Enable all access for authenticated users" ON public.devices
    FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.experiments
    FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.experiment_data
    FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.data_files
    FOR ALL USING (true);

CREATE POLICY "Enable all access for authenticated users" ON public.simulation_configs
    FOR ALL USING (true);