import { isFloat, isInt } from '../const/utils.js';

export class Asset {
	/**
	 * @system_date - the initialization time
	 * @headers - the headers of the data table (used for attributes setup)
	 * @first_row - the first row of the data table (used for attributes setup)
	 */
	constructor(system_date, id, name, description, headers, first_row, attributes) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.system_date = system_date;
		this.attributeTypes = {};
		this.attributes = attributes;

		first_row.forEach((value, i) => {
			if (headers[i].toLowerCase().includes('date')) {
				this.attributeTypes[headers[i]] = 'date';
				return;
			}

			if (
				headers[i].toLowerCase().includes('volume') ||
				headers[i].toLowerCase().includes('ratio') ||
				headers[i].toLowerCase().includes('dividend')
			) {
				this.attributeTypes[headers[i]] = 'int';
				return;
			}

			if (isFloat(value)) {
				this.attributeTypes[headers[i]] = 'float';
			} else {
				this.attributeTypes[headers[i]] = 'string';
			}
		});
	}
}
