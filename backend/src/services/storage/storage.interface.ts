export interface IStorageService {
  /**
   * Saves a file to the storage provider.
   * @param file The file object provided by Multer
   * @param folder The folder path or bucket subdirectory (e.g., 'profiles', 'projects')
   * @returns The relative or absolute URL/path to access the file
   */
  saveFile(file: Express.Multer.File, folder: string): Promise<string>;

  /**
   * Deletes a file from the storage provider.
   * @param fileUrl The URL or path of the file to delete
   */
  deleteFile(fileUrl: string): Promise<void>;
}
export default IStorageService;
