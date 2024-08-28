class ApiResponse{
    constructor(
        statusCode,
        data,
        message="Success"

    ){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.data=data
        this.success=statusCode < 400
    }
}