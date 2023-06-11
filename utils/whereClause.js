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