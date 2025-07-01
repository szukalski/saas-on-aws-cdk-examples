$version: "2.0"

namespace com.saasonaws

string TenantId
string Url

@error("client")
@httpError(401)
structure UnauthorizedError {
  message: String
}

@error("client")
@httpError(403)
structure ForbiddenError {}

/// An error indicating a resource could not be found
@httpError(404)
@error("client")
structure ResourceNotFoundError {
    @required
    message: String
}

// An error indicating an internal server error
@httpError(500)
@error("server")
structure InternalServerError {
    @required
    message: String
}