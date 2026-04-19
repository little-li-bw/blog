package com.bowen.blog.upload.mapper;

import com.bowen.blog.upload.entity.UploadFile;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface UploadFileMapper {

    @Insert("""
            INSERT INTO upload_file (file_name, file_path, file_url)
            VALUES (#{fileName}, #{filePath}, #{fileUrl})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UploadFile uploadFile);
}
