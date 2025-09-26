import { useUserData } from "../store/useUserData";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { Timestamp } from "firebase/firestore";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmMakeAdmin, setConfirmMakeAdmin] = useState(false);
  const { fetchUsers, usersData, deleteUserPhoto } = useUserData();
  const [isConfirmDeletePhoto, setConfirmDeletePhoto] = useState(false)
  const { makeAdmin } = useAuth();
  const navigate = useNavigate()

  // Мемоизируем fetchUsers чтобы избежать изменения ссылки
  const stableFetchUsers = useCallback(async () => {
    try {
      await fetchUsers();
    } catch (error) {
      console.error("error fetching users: ", error);
    }
  }, [fetchUsers]);

  useEffect(() => {
    stableFetchUsers();
  }, [stableFetchUsers]); // Зависимость от мемоизированной функции

  const handleMakeAdmin = async (uid) => {
    try {
      await makeAdmin(uid);
      // После успешного назначения админа обновляем список пользователей
      await stableFetchUsers();
      setConfirmMakeAdmin(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error making user admin: ", error);
    }
  };

   const handleDeletePhoto = async (uid) => {
    try {
      await makeAdmin(uid);
      await stableFetchUsers();
      setConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error making user admin: ", error);
    }
  };

  const formatFirebaseTimestamp = (timestamp) => {
    if (!timestamp) return "No date";

    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (
      timestamp.seconds !== undefined &&
      timestamp.nanoseconds !== undefined
    ) {
      try {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return "Invalid date";
      }
    }
    return timestamp.toString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        User Management
      </h1>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full dark:text-white">
          <thead className="bg-gray-200 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role & Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {usersData?.map((user) => (
              <tr
                key={user.uid}
                className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10" onClick={()=>navigate(`/user/${user.uid}`)}>
                      
                      {user.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt="Profile"
                          className="h-10 w-10 rounded-full border-2 border-red-600 object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-neutral-200 to-red-400 dark:from-neutral-700 dark:to-red-600 rounded-full h-10 w-10 flex items-center justify-center border-2 border-red-600">
                          <UserCircleIcon className="h-8 w-8 text-red-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.displayName}
                      </div>
                    </div>
               
                  </div>
                    {user.profilePhoto && user.role === "user" && <button onClick={()=>deleteUserPhoto(user.uid)} className="text-sm text-red-600 hover:text-red-700 cursor-pointer transition-colors">Delete photo</button>}
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatFirebaseTimestamp(user.createdAt)}
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatFirebaseTimestamp(user.lastLogin)}
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-700">
                      {user.role}
                    </span>

                    {user.role !== "admin" && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setConfirmMakeAdmin(true);
                          }}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-3xl shadow-sm text-white bg-neutral-400 hover:bg-neutral-600 dark:bg-neutral-600 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors cursor-pointer"
                        >
                          Make Admin
                        </button>
                      
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isConfirmMakeAdmin && selectedUser && (
        <ConfirmationModal
          title={`Make ${selectedUser.displayName} admin?`}
          setClose={() => {
            setConfirmMakeAdmin(false);
            setSelectedUser(null);
          }}
          setConfirm={() => handleMakeAdmin(selectedUser.uid)}
        />
      )}
      {isConfirmDeletePhoto && selectedUser && (
        <ConfirmationModal title={`Delete ${selectedUser.displayName}'s profile photo?`} setClose={()=> {setConfirmDeletePhoto(false)
            setSelectedUser(null)}}   setConfirm={() => handleDeletePhoto(selectedUser.uid)}/>
        
      )}
    </div>
  );
};