class Whereclause{
    constructor(base,bigQ){
        this.base = base
        this.bigQ = bigQ
    }

    search(){
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: 'i'
            }
        } : {}

        this.base = this.base.find({...searchword})
        return this
    }

    filter(){
        const copyQ = {...this.bigQ}

        delete copyQ["search"]
        delete copyQ["limit"]
        delete copyQ["page"]

        let str = JSON.stringify(copyQ)

        str = str.replace(/\b(gte|lte|gt|lt)\b/g, m=> `$${m}`)

        let jsonOfCopyQ = JSON.parse(str)

        this.base = this.base.find(jsonOfCopyQ)
        return this
    }

    pager(resultperpage){
        let currentPage=1
        if(this.bigQ.page){
            currentPage = this.bigQ.page
        }

        const skipVal = resultperpage * (currentPage-1)

        this.base = this.base.limit(resultperpage).skip(skipVal)
        return this
    }
}

module.exports = Whereclause