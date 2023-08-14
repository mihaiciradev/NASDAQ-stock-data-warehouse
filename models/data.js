export class Data {
	constructor(asset_id, data_source_id, business_date, system_date, values_double, values_int, values_text) {
		this.asset_id = asset_id;
		this.data_source_id = data_source_id;
		this.business_date = business_date;
		this.system_date = system_date;
		this.values_double = values_double;
		this.values_int = values_int;
		this.values_text = values_text;
	}
}
