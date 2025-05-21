import axiosInstance from './axiosConfig';

// Admin Settings API endpoints
const ADMIN_SETTINGS_ENDPOINTS = {
  GET_ADMINS: '/admin/admins',
  CREATE_ADMIN: '/admin/create-admin',
  UPDATE_ADMIN: '/admin/update-admin',
  DELETE_ADMIN: '/admin/delete-admin',
};

// Admin Settings API service
const adminSettingsApi = {
  /**
   * Get all admins
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with the API response
   */
  getAdmins: async (page = 1, limit = 15) => {
    try {
      const response = await axiosInstance.get(ADMIN_SETTINGS_ENDPOINTS.GET_ADMINS, {
        params: { page, limit },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching admin list:', error);
      throw error;
    }
  },

  /**
   * Create a new admin
   * @param adminData - Admin data to create
   * @returns Promise with the API response
   */
  createAdmin: async (adminData: any) => {
    try {
      const response = await axiosInstance.post(
        ADMIN_SETTINGS_ENDPOINTS.CREATE_ADMIN,
        adminData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  /**
   * Update an admin
   * @param adminId - ID of the admin to update
   * @param adminData - Updated admin data
   * @returns Promise with the API response
   */
  updateAdmin: async (adminId: number, adminData: any) => {
    try {
      const response = await axiosInstance.put(
        `${ADMIN_SETTINGS_ENDPOINTS.UPDATE_ADMIN}/${adminId}`,
        adminData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  /**
   * Delete an admin
   * @param adminId - ID of the admin to delete
   * @returns Promise with the API response
   */
  deleteAdmin: async (adminId: number) => {
    try {
      const response = await axiosInstance.delete(
        `${ADMIN_SETTINGS_ENDPOINTS.DELETE_ADMIN}/${adminId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },
};

export default adminSettingsApi;
