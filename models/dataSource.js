export class DataSource {
	constructor(id, name, description, system_date, attributes) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.system_date = system_date;
		this.attributes = attributes; //set<text>
	}
}
