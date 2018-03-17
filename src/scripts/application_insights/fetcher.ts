export async function run_ai_query<C>(query: string): Promise<C[]> {
    const urlEncoded = encodeURIComponent(query);
    const url = `https://api.applicationinsights.io/v1/apps/6d77e5f7-edb8-4a0c-93c9-6b73815c67d2/query?query=${urlEncoded}`;
    let request = await fetch(url, {
        method: 'GET',
        headers: {
            'x-api-key': (() => { throw new Error("AI KEY HERE") })(),
        }
    });
    let body = await request.text();
    let decoded = JSON.parse(body);
    let merged = merge_data(decoded.tables[0].columns, decoded.tables[0].rows);
    return merged as C[];
}

interface Column {
    name: string,
    type: 'datetime' | 'string' | 'dynamic' | 'int' | 'real',
}


function merge_data(columns: Column[], rows: any[][]): any[] {
    const out: any[] = [];
    for (const row of rows) {
        let obj: any = {};
        for (const i in row) {
            let field = row[i];
            const type = columns[i].type;
            const name = columns[i].name;
            if (type === 'datetime') {
                field = new Date(field);
            }
            if (name === 'customDimensions') {
                field = JSON.parse(field);
            }
            obj[name] = field;
        }
        out.push(obj);
    }

    return out
}
