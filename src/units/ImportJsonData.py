import csv
import json
import os

def csv_to_json(csv_file_path, json_file_path=None):
    """
    将CSV文件转换为JSON格式
    """
    if json_file_path is None:
        json_file_path = csv_file_path.replace('.csv', '.json')
    
    data = []
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
            # 自动检测CSV分隔符
            sample = csv_file.read(1024)
            csv_file.seek(0)
            sniffer = csv.Sniffer()
            delimiter = sniffer.sniff(sample).delimiter
            
            csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
            
            for row in csv_reader:
                # 清理空白字符并转换数据类型
                cleaned_row = {}
                for key, value in row.items():
                    key = key.strip() if key else key
                    value = value.strip() if value else value
                    
                    # 尝试转换为数字
                    if value.isdigit():
                        cleaned_row[key] = int(value)
                    elif value.replace('.', '', 1).isdigit():
                        cleaned_row[key] = float(value)
                    elif value.lower() in ['true', 'false']:
                        cleaned_row[key] = value.lower() == 'true'
                    else:
                        cleaned_row[key] = value
                
                data.append(cleaned_row)
        
        # 写入JSON文件
        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent=2)
        
        print(f"✅ 成功转换为JSON: {json_file_path}")
        print(f"📊 共处理 {len(data)} 条记录")
        return data
        
    except FileNotFoundError:
        print(f"❌ 错误: 找不到文件 {csv_file_path}")
        return None
    except Exception as e:
        print(f"❌ 转换过程中出错: {str(e)}")
        return None

def csv_to_js(csv_file_path, js_file_path=None, var_name="data"):
    """
    将CSV文件转换为JS格式（可直接在前端使用的JS变量）
    """
    if js_file_path is None:
        js_file_path = csv_file_path.replace('.csv', '.js')
    
    # 先转换为数据
    data = csv_to_json(csv_file_path)
    if data is None:
        return None
    
    try:
        # 生成JS文件
        with open(js_file_path, 'w', encoding='utf-8') as js_file:
            js_file.write(f"// 从 {os.path.basename(csv_file_path)} 生成的数据\n")
            js_file.write(f"const {var_name} = ")
            json.dump(data, js_file, ensure_ascii=False, indent=2)
            js_file.write(";\n\n")
            js_file.write(f"// 如果在Node.js环境中使用\n")
            js_file.write(f"if (typeof module !== 'undefined' && module.exports) {{\n")
            js_file.write(f"  module.exports = {var_name};\n")
            js_file.write(f"}}\n")
        
        print(f"✅ 成功转换为JS: {js_file_path}")
        return data
        
    except Exception as e:
        print(f"❌ 生成JS文件时出错: {str(e)}")
        return None

def main():
    csv_file = "flows.csv"
    
    print("🔄 CSV 数据转换工具")
    print("=" * 30)
    
    if not os.path.exists(csv_file):
        print(f"❌ 错误: 找不到文件 {csv_file}")
        print("请确保 flows.csv 文件在当前目录下")
        return
    
    # 转换为JSON
    print(f"📁 正在处理文件: {csv_file}")
    json_data = csv_to_json(csv_file)
    
    if json_data:
        # 显示数据预览
        print("\n📋 数据预览:")
        if len(json_data) > 0:
            print(f"字段: {list(json_data[0].keys())}")
            print(f"前3条记录:")
            for i, record in enumerate(json_data[:3]):
                print(f"  {i+1}: {record}")
        
        # 转换为JS
        print("\n🔄 生成JS文件...")
        csv_to_js(csv_file, var_name="flowsData")
        
        print("\n✨ 转换完成！")
        print("\n📖 使用方法:")
        print("1. JSON格式 (flows.json):")
        print("   - 可用于fetch API: fetch('flows.json')")
        print("   - 或直接在JavaScript中导入")
        
        print("\n2. JS格式 (flows.js):")
        print("   - HTML中: <script src='flows.js'></script>")
        print("   - 然后使用: console.log(flowsData)")
        print("   - ES模块: import flowsData from './flows.js'")

if __name__ == "__main__":
    main()