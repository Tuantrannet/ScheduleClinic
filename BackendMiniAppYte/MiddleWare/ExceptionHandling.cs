using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.MiddleWare
{
    public class ExceptionHandling
    {
        private readonly RequestDelegate requestDelegate;
        private readonly ILogger<ExceptionHandling> logger;
        public ExceptionHandling(RequestDelegate requestDelegate, ILogger<ExceptionHandling> logger)
        {
            this.requestDelegate = requestDelegate;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            try
            {
                await requestDelegate(httpContext);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unhandled exception at {Path} {Method}",
                httpContext.Request.Path, httpContext.Request.Method);
                await HandleException(httpContext, ex);
            }
        }

        public async Task HandleException(HttpContext httpContext, Exception ex)
        {
            var response = httpContext.Response;
            response.ContentType = "application/json";

            response.StatusCode = ex switch
            {
                ArgumentNullException => (int)HttpStatusCode.BadRequest,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                InvalidOperationException => (int)HttpStatusCode.Conflict,
                DbUpdateException => (int)HttpStatusCode.InternalServerError,
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var errorMessage = new
            {
                statusCode = response.StatusCode,
                message = ex.Message,
                path = httpContext.Request.Path,
                traceId = httpContext.TraceIdentifier
            };

            await response.WriteAsJsonAsync(errorMessage);
        }
    }
}
