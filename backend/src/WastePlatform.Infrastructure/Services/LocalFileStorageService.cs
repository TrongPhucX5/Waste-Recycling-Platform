using Microsoft.AspNetCore.Http;
using WastePlatform.Application.Common.Interfaces;

namespace WastePlatform.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    public Task<string> SaveFileAsync(IFormFile file, string[] allowedExtensions, long maxSizeInBytes, CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty.");
        }

        var fileExtension = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new InvalidOperationException($"Invalid file type: {fileExtension}");
        }

        if (file.Length > maxSizeInBytes)
        {
            throw new InvalidOperationException("File size exceeds limit.");
        }

        var fileName = $"{Guid.NewGuid()}{fileExtension}";
        
        // Preserve original behavior: only return the UUID filename. 
        // Real systems would save to local disk or S3 bucket here.
        return Task.FromResult(fileName);
    }
}
