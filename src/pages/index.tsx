import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export default function Home() {

  const [files, setFiles] = useState<Array<File>>([]);

  const onSubmit = useCallback((event: any) => {
    event.preventDefault();

    const data = new FormData();
    data.append('files', files.length.toString());
    for (let i = 0; i < files.length; i++) {
      data.append(`file[${i}]`, files[i]);
    }

    fetch("/api/upload", {
      method: "POST",
      body: data,
    });
  }, [files]);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    // Do something with the files
    setFiles(acceptedFiles);
  }, [])

  const { getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject } = useDropzone({
      onDrop, accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/gif': ['.gif'],
        'image/webp': ['.webp'],
      }
    });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return <main>
    <form onSubmit={onSubmit}>
      {/* @ts-ignore */}
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag n drop some files here, or click to select files</p>
      </div>
      <button type="submit">
        Upload
      </button>
    </form>
  </main>
}