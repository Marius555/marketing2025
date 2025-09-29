import * as React from "react"
import { Upload, X, File, Image, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const FileUpload = React.forwardRef(({
  className,
  accept,
  multiple = false,
  maxFiles = 1,
  maxSize = 50 * 1024 * 1024, // 50MB default
  onFilesChange,
  value = [],
  ...props
}, ref) => {
  const [dragActive, setDragActive] = React.useState(false)
  const [errors, setErrors] = React.useState([])
  const inputRef = React.useRef(null)
  const files = Array.isArray(value) ? value : value ? [value] : []

  const validateFile = (file) => {
    const errors = []

    // Size validation
    if (file.size > maxSize) {
      errors.push(`File "${file.name}" is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB.`)
    }

    // Type validation based on accept prop
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const isValidType = acceptedTypes.some(acceptType => {
        if (acceptType.includes('*')) {
          const baseType = acceptType.split('/')[0]
          return file.type.startsWith(baseType + '/')
        }
        return file.type === acceptType
      })

      if (!isValidType) {
        errors.push(`File "${file.name}" type is not supported. Accepted types: ${accept}`)
      }
    }

    return errors
  }

  const handleFiles = (newFiles) => {
    console.log('🔍 FileUpload handleFiles called with:', newFiles.length, 'files')

    const fileArray = Array.from(newFiles)
    const validationErrors = []
    const validFiles = []

    fileArray.forEach((file, index) => {
      console.log(`📁 Processing file ${index}:`, file.name, file.size, 'bytes', file.type)
      const fileErrors = validateFile(file)
      if (fileErrors.length > 0) {
        console.log(`❌ File ${file.name} validation failed:`, fileErrors)
        validationErrors.push(...fileErrors)
      } else {
        console.log(`✅ File ${file.name} validation passed`)
        validFiles.push(file)
      }
    })

    setErrors(validationErrors)

    // Determine final files based on validation and limits
    let finalFiles
    if (validFiles.length > 0) {
      if (multiple) {
        finalFiles = validFiles.slice(0, maxFiles)
      } else {
        finalFiles = validFiles[0] // Single file, not array
      }
    } else {
      finalFiles = multiple ? [] : null
    }

    console.log('📤 Calling onFilesChange with:', finalFiles)
    console.log('📤 Type check - multiple:', multiple, 'finalFiles type:', typeof finalFiles, 'isArray:', Array.isArray(finalFiles))

    // Call onFilesChange with consistent data type
    onFilesChange?.(finalFiles)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index) => {
    console.log('🗑️ Removing file at index:', index)
    setErrors([]) // Clear errors when removing files

    let updatedFiles
    if (multiple) {
      updatedFiles = files.filter((_, i) => i !== index)
      console.log('📤 Calling onFilesChange after removal with array:', updatedFiles)
    } else {
      updatedFiles = null
      console.log('📤 Calling onFilesChange after removal with: null')
    }

    onFilesChange?.(updatedFiles)
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('video/')) return Video
    return File
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        {...props}
      />

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">
          {accept ? `Supports: ${accept}` : 'Any file type'}
          {multiple && ` (max ${maxFiles} files)`}
          {` • Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB per file`}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="text-sm font-medium text-destructive mb-1">Upload Errors:</div>
          <ul className="text-xs text-destructive space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file)
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})

FileUpload.displayName = "FileUpload"

export { FileUpload }