
const SQL = createSampleSQL('table_name', [
    { name: 'id' },
    { name: 'text', editable: true },
    { name: 'kana', editable: false },
    { name: 'source', editable: true },
    { name: 'testName', column: 't_name', editable: true },
    { name: 'xxx', editable: true },
])

const model = {}

const SELECT_USERS_SQL = (id: number) => SQL.SELECT().WHERE({ id }).LIMIT().ORDER('').END()

SQL.SELECT([]).WHERE({})

SQL.UPDATE(model).WHERE({ id: 1 })
SQL.DELETE().WHERE({ id: 1 })
SQL.INSERT(model)

SQL.SELECT()

function SQLDSL(strs: TemplateStringsArray, ...args: any[]) {
    return ''
}

const SELECT_USERS_SQL2 = (id: number) => SQLDSL`SELECT WHERE ${{ id }} LIMIT 1 2 ORDER xxx.asc xxx.asc `

const x = SQLDSL`SELECT WHERE ${{ id: 1 }} LIMIT 1 ORDER ${1}`

const xxx = SQLDSL`DELETE WHERE ${{ id: 1 }}`

function COMBINE(...strs: string[]) {
    return ''
}
function DSL(strs: TemplateStringsArray, ...args: any[]) {
    return ''
}

DSL`COMBINE ${SQLDSL`SELECT ON id JOIN`} ${SQLDSL`SELECT ON id`}`

COMBINE(
    SQLDSL`SELECT ON id JOIN`,
    SQLDSL`SELECT ON id`,
)

const xxxx = SQLDSL`SELECT ON id JOIN ${SQLDSL`SELET ON id`} ${SQLDSL`SELET ON id`}`

// SELECT xxxx [SELECT_PLACEHOLDER] | (`table_name` INNER JOIN [TABLE_PLACEHOLDER] ON tablename.id = [TABLE_PLACEHLDER])
// SQLDSL`SELECT ON `

// const SQLx = `${SQLDSL`SELECT`}${SQLDSL`SELECT`}`
// SQLDSL`SELECT` + SQLDSL`SELECT`
// SQLDSL`SELECT ON ${'id'} JOIN ${
//     SQLDSL`SELECT ON ${'id'}`
// }`
// SQLJOIN(
//     SQL.SELECT(),
//     SQL.SELECT(),
// )
// SQLx(
    
// ).END()

// `SELECT a.xxx ON a.xxxx`
// `SELECT b.xxx ON b.xxx JOIN`

SQL.SELECT().ON('id').JOIN(
    SQL.SELECT().ON('id').JOIN(
        SQL.SELECT().ON('id').END()
    ).END(),
).END()

// SQL.SELECT().ON('id').JOIN(

// )

// select xxx, xxx FROM
//  (A JOIN B ON a.x = B.x)

// SQL.JOIN(
//     SQL.SELECT()
// ).END()

import mysql from 'mysql'

type SQLStrings =  {
    select?: string
    where?: string
    update?: string
    delete?: boolean
    total?: string
    insert?: string
    limit?: string
    order?: string
}


class SampleSQLBuilder<T = any> {
    private strs : SQLStrings = {}
    private mapper: any[]
    private name: string
    constructor(name: string, mapper: any[]) {
        this.name = name
        this.mapper = mapper.filter(m => !!m.name)
        
    }
    public SELECT(type?: 'INC' | 'EXC' | string[] , names?: string[]) {
        if (Array.isArray(type)) {
            names = type || []
            type = 'INC'
        }
        let mapper = this.mapper
        const filterNames = names
        if (filterNames && type === 'INC') {
            mapper = this.mapper.filter(m => filterNames.includes(m.name))
        } else if (filterNames && type === 'EXC') {
            mapper = this.mapper.filter(m => !filterNames.includes(m.name))
        }
        const select = mapper.map(m => m.column 
            ? mysql.format('?? as ??', [m.column, m.name]) 
            : mysql.format('??', [m.name])
        ).join(', ')
        this.strs.select = select
        return this
    }
    public INSERT(model: any) {
        const keys = Object.keys(model)
        const mapper = this.mapper.filter(m => keys.includes(m.name) && model[m.name])
        const insert = mapper.map(m => mysql.format('??', [m.name])).join(', ')
        const values = mapper.map(m => mysql.format('?', [model[m.name]])).join(', ')
        this.strs = { insert: `(${insert}) VALUES(${values})` }
        return this
    }
    public UPDATE(model: any) {
        const keys = Object.keys(model)
        const mapper = this.mapper.filter(m => keys.includes(m.name) && model[m.name])
        const update = mapper.map(m => mysql.format('??=?', [m.name, model[m.name]])).join(', ')
        this.strs.update = update
        return this
    }
    
    public WHERE(type: 'AND' | 'OR' | any, query?: any) {
        if (typeof type === 'string') {
            query = type
            type = 'AND'
        }
        const keys = Object.keys(query)
        const mapper = this.mapper.filter(m => keys.includes(m.name) && query[m.name])
        const where = mapper.map(m => {
            const v = query[m.name]
            if (!Array.isArray(v)) {
                return mysql.format('??=?', [m.name, v])
            } else {
                const placeholders = v.map(() => '?').join(', ')
                return mysql.format(`?? IN (${placeholders})`, [m.name, ...v])
            }
        }).join(` ${type} `)
        this.strs.where = where 
        return this
    }
    public ORDER(orderStr: string | string[]) {
        const orderStrs = Array.isArray(orderStr) ? orderStr : [orderStr]
        const orders = orderStrs.map(o => {
            const [ name, type ] = o.split('\.')
            return { name, type: type.toUpperCase() }
        }).filter(o => o.name 
            && ['ASC', 'DESC'].includes(o.type) 
            && this.mapper.find(m => m.name === o.name)
        )
        const order = orders.map(o => mysql.format(`?? ${o.type}`, [o.name])).join(', ')
        this.strs.order = order
        return this
    }
    public TOTAL(name: string = 'total') {
        this.strs.total = mysql.format('FOUND_ROWS() as ??', [name])
        return this
    }
    public DELETE() {
        this.strs.delete = true
        return this
    }
    public LIMIT(num: number = 1, offset?: number) {
        if (!offset) {
            this.strs.limit = mysql.format('?', [num])
        } else {
            this.strs.limit = mysql.format('?, ?', [offset, num])
        }
        return this
    }

    public JOIN(builder: SampleSQLBuilder) {
        return this
    }

    public ON(name: string) {
        return this
    }
    
    public END() {
        const { select, update, delete: _delete, insert } = this.strs
        if ([select, update, _delete, insert].filter(Boolean).length > 1) {
            return ''
        } else if (select) {
            return this.createSelectSQL()
        } else if (update) {
            return this.createUpdateSQL()
        } else if (_delete) {
            return this.createDeleteSQL()
        } else if (insert) {
            return this.createInsertSQL()
        }
        return ''
    }

    private createSelectSQL() {
        const { strs, name } = this
        let selectStr = strs.select
        if (strs.total) {
            selectStr = `SQL_CALC_FOUND_ROWS ${selectStr}`
        }
        let sql = mysql.format(`SELECT ${selectStr} FROM ??`, [name])
        if (strs.where) {
            sql += `WHERE ${strs.where}`
        }
        if (strs.order) {
            sql += `ORDER BY ${strs.limit}`
        }
        if (strs.limit) {
            sql += `LIMIT ${strs.limit}`
        }
        if (strs.total) {
            sql += `; SELECT ${strs.total}`
        }
        return sql
    }
    private createInsertSQL() {
        const { strs, name } = this
        return mysql.format(`INSERT INTO ??${strs.insert}`, [name])
    }
    
    private createUpdateSQL() {
        const { strs, name } = this
        let sql = mysql.format(`UPDATE ?? SET ${strs.update}`, [name])
        if (strs.where) {
            sql += `WHERE ${strs.where}`
        }
        return sql
    }

    private createDeleteSQL() {
        const { strs, name } = this
        let sql = mysql.format(`DELETE FROM ??`, [name])
        if (strs.where) {
            sql += `WHERE ${strs.where}`
        }
        return sql
    }
}

function createSampleSQL(name: string, mapper: any) {
    return new SampleSQLBuilder(name, mapper)
}


