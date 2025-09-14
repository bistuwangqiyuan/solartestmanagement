-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 测试数据主表
CREATE TABLE IF NOT EXISTS test_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_date TIMESTAMP WITH TIME ZONE NOT NULL,
    voltage DECIMAL(10,2),
    current DECIMAL(10,2),
    power DECIMAL(10,2),
    device_address INTEGER,
    device_type VARCHAR(50),
    batch_id UUID,
    import_id UUID,
    test_duration INTEGER, -- 测试持续时间(秒)
    test_result VARCHAR(20), -- 合格/不合格
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- 导入批次表
CREATE TABLE IF NOT EXISTS import_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    import_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    record_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending/processing/completed/failed
    error_details JSONB,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 设备信息表
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_address INTEGER UNIQUE NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    calibration_date DATE,
    next_calibration_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- active/inactive/maintenance
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 数据分析结果表
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_type VARCHAR(50) NOT NULL, -- daily/weekly/monthly/custom
    date_range_start DATE,
    date_range_end DATE,
    parameters JSONB,
    results JSONB,
    summary JSONB,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户操作日志表
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 告警规则表
CREATE TABLE IF NOT EXISTS alert_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- threshold/trend/anomaly
    parameters JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    notification_channels JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 告警记录表
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID REFERENCES alert_rules(id),
    alert_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity VARCHAR(20), -- low/medium/high/critical
    message TEXT,
    data JSONB,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_test_records_test_date ON test_records(test_date DESC);
CREATE INDEX idx_test_records_device_address ON test_records(device_address);
CREATE INDEX idx_test_records_batch_id ON test_records(batch_id);
CREATE INDEX idx_test_records_import_id ON test_records(import_id);
CREATE INDEX idx_import_batches_status ON import_batches(status);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_acknowledged ON alerts(acknowledged);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_test_records_updated_at
    BEFORE UPDATE ON test_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_system_configs_updated_at
    BEFORE UPDATE ON system_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_alert_rules_updated_at
    BEFORE UPDATE ON alert_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 创建视图：最新测试数据
CREATE OR REPLACE VIEW latest_test_records AS
SELECT 
    tr.*,
    d.device_name,
    d.manufacturer,
    d.model,
    d.status as device_status
FROM test_records tr
LEFT JOIN devices d ON tr.device_address = d.device_address
ORDER BY tr.test_date DESC
LIMIT 1000;

-- 创建视图：每日统计
CREATE OR REPLACE VIEW daily_statistics AS
SELECT 
    DATE(test_date) as test_day,
    COUNT(*) as total_tests,
    COUNT(CASE WHEN test_result = '合格' THEN 1 END) as passed_tests,
    COUNT(CASE WHEN test_result = '不合格' THEN 1 END) as failed_tests,
    ROUND(COUNT(CASE WHEN test_result = '合格' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2) as pass_rate,
    AVG(voltage) as avg_voltage,
    AVG(current) as avg_current,
    AVG(power) as avg_power,
    MIN(power) as min_power,
    MAX(power) as max_power
FROM test_records
WHERE test_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(test_date)
ORDER BY test_day DESC;

-- 插入默认系统配置
INSERT INTO system_configs (config_key, config_value, description) VALUES
('voltage_threshold', '{"min": 0, "max": 1000, "warning_min": 10, "warning_max": 900}', '电压阈值配置'),
('current_threshold', '{"min": 0, "max": 100, "warning_min": 0.1, "warning_max": 90}', '电流阈值配置'),
('power_threshold', '{"min": 0, "max": 10000, "warning_min": 1, "warning_max": 9000}', '功率阈值配置'),
('data_retention_days', '{"test_records": 365, "audit_logs": 90, "alerts": 180}', '数据保留天数配置'),
('report_settings', '{"default_format": "PDF", "include_charts": true, "logo_url": null}', '报表设置')
ON CONFLICT (config_key) DO NOTHING;

-- 插入默认告警规则
INSERT INTO alert_rules (rule_name, rule_type, parameters) VALUES
('低电压告警', 'threshold', '{"field": "voltage", "operator": "<", "value": 10, "duration": 300}'),
('高电流告警', 'threshold', '{"field": "current", "operator": ">", "value": 90, "duration": 300}'),
('连续故障告警', 'trend', '{"field": "test_result", "value": "不合格", "count": 5, "window": 3600}'),
('设备离线告警', 'anomaly', '{"check_interval": 600, "offline_threshold": 1800}');