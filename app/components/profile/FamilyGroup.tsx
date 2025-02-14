'use client'

import React, { useState, startTransition } from 'react'
import Link from 'next/link'
import { Family } from '@/app/lib/definitions'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import NotificationsIcon from "@mui/icons-material/Notifications";
import { IconButton } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import { validateFamilyGroup, validateJoinFamilyGroup, FamilyNameState, JoinState } from '@/app/lib/actions'
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

interface FamilyGroupProps {
  familyGroup: Family[];
  requests: {
    request_id: number;
    message: string;
  }[];
  userId: number;
}

const FamilyGroup: React.FC<FamilyGroupProps> = ({ familyGroup, requests, userId }) => {

  const initialFamilyNameState = {
    message: null,
    errors: {},
  } as FamilyNameState;

  const initialJoinState = {
    message: null,
    errors: {},
  } as JoinState;

  const [localFamilyGroup, setLocalFamilyGroup] = useState<Family[]>(familyGroup);
  const [notificationsModal, setNotificationsModal] = useState<boolean>(false);
  const [familyName, setFamilyName] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [newFamily, setNewFamily] = useState<boolean>(false);
  const [familyState, setFamilyState] = useState(initialFamilyNameState);
  const [joinState, setJoinState] = useState(initialJoinState);
  const [editFamily, setEditFamily] = useState<boolean>(false);
  const [editReady, setEditReady] = useState<boolean>(false);
  const [familyId, setFamilyId] = useState<string | undefined>();
  const [joinFamily, setJoinFamily] = useState<boolean>(false);
  const [localRequests, setLocalRequests] = useState(requests);



  const handleNotifications = () => {
    setNotificationsModal(!notificationsModal);
  }

  const handleApproval = async (request_id: number, action: 'approve' | 'deny') => {
    switch (action) {
    case 'approve':
      const response = await fetch('/api/approve-family-group', {
        method: 'POST',
        body: JSON.stringify({ requestId: request_id }),
      })
      if (!response.ok) {
        console.error('Failed to approve request', request_id);
        return;
      };
      const data = await response.json();
      alert(
        data.message === "Success"
          ? "Successfully approved family group request."
          : "Failed to approve family group request."
      );
      setLocalRequests((prevRequests) => prevRequests.filter((request) => request.request_id !== request_id));
      setNotificationsModal(false);
      break;
    case 'deny':
      console.log('Deny request', request_id);
      const denyResponse = await fetch('/api/deny-family-group', {
        method: 'POST',
        body: JSON.stringify({ requestId: request_id }),
      });
      if (!denyResponse.ok) {
        console.error('Failed to deny request', request_id);
        return;
      };
      const denyData = await denyResponse.json();
      alert(
        denyData.message === "Success"
          ? "Successfully denied family group request."
          : "Failed to deny family group request."
      );
      setLocalRequests((prevRequests) => prevRequests.filter((request) => request.request_id !== request_id));
      setNotificationsModal(false);
      break;
    default:
      break;
    }
  };

  const handleLeaveFamily = async (familyId: string) => {
    const confirmLeave = confirm('Are you sure you want to leave this family group?');
    if (!confirmLeave) return;
    const response = await fetch('/api/leave-family-group', {
      method: 'POST',
      body: JSON.stringify({ userId, familyId }),
    });
    if (!response.ok) {
      console.error('Failed to leave family group');
      return;
    };
    setLocalFamilyGroup((prevFamilyGroup) => prevFamilyGroup.filter((family) => family.family_id !== familyId));
  }

    const handleFamilySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('familyName', familyName);
    if (!editReady) {
      formData.append("userId", userId.toString());
    } else {
      if (familyId) {
        formData.append("familyId", familyId.toString());
      }
    }
    startTransition(() => {
      validateFamilyGroup(initialFamilyNameState, formData).then(async (validatedFamilyNameState) => {
        setFamilyState(validatedFamilyNameState);
        if (
          validatedFamilyNameState.errors &&
          Object.keys(validatedFamilyNameState.errors).length === 0
        ) {
          if (!editReady) {
            const response = await fetch("/api/add-family-group", {
              method: "POST",
              body: JSON.stringify({ familyName, userId }),
            });
            if (!response.ok) {
              console.error("Failed to create family group");
              new Error("Failed to create family group");
            }
            const data = await response.json();
            if (data) {
              setLocalFamilyGroup((prevFamilyGroup) => [
                ...prevFamilyGroup,
                {
                  family_id: data.familyId,
                  family_name: data.familyName,
                },
              ]);
              setFamilyName("");
              setNewFamily(false);
            }
          } else {
            const response = await fetch("/api/edit-family-group", {
              method: "POST",
              body: JSON.stringify({ familyId, familyName }),
            })
            if (!response.ok) {
              console.error("Failed to update family group");
              new Error("Failed to update family group");
            }
            const data = await response.json();
            if (data) {
              setLocalFamilyGroup((prevFamilyGroup) =>
                prevFamilyGroup.map((family) =>
                  family.family_id === data.familyId
                    ? { family_id: data.familyId, family_name: data.familyName }
                    : family
                )
              );
              setFamilyName("");
              setFamilyId(undefined);
              setEditReady(false);
            }
          }
        }
      });
    });
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('familyName', familyName);
    formData.append('recipientEmail', recipientEmail);
    startTransition(() => {
      validateJoinFamilyGroup(initialJoinState, formData).then(
        async (validatedJoinFamilyGroup) => {
          setJoinState(validatedJoinFamilyGroup);
          if (
            validatedJoinFamilyGroup.errors &&
            Object.keys(validatedJoinFamilyGroup.errors).length === 0
          ) {
            const response = await fetch("/api/join-family-group", {
              method: "POST",
              body: JSON.stringify({ familyName, recipientEmail, userId }),
            });
            if (!response.ok) {
              console.error("Failed to solicit join family group");
              new Error("Failed to solicit join family group");
            }
            if (response.ok) {
                const data = await response.json();
                alert(data.message === "Success" 
                ? "Your family group request was sent successfully." 
                : "Your family group request failed.");
                setFamilyName("");
                setRecipientEmail("");
                setJoinFamily(false);
            }              
          }
        }
      );
    });
  }

  
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex space-x-2 mb-4">
          {!editFamily && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setNewFamily(!newFamily)}
            >
              New
            </Button>
          )}
          {familyGroup.length > 0 && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: editFamily ? "red" : "goldenrod",
                "&:hover": {
                  backgroundColor: editFamily ? "#AA0000" : "darkgoldenrod",
                },
              }}
              onClick={() => setEditFamily(!editFamily)}
            >
              {editFamily ? "Cancel" : "Edit"}
            </Button>
          )}

          {!editFamily && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "limegreen",
                "&:hover": {
                  backgroundColor: "forestgreen",
                },
              }}
              onClick={() => setJoinFamily(!joinFamily)}
            >
              Join
            </Button>
          )}
        </div>
        <section className="p-4 relative w-full bg-gray-100 rounded-lg mb-6 shadow-lg">
          <div className="flex justify-between mb-4">
            <h2 className="text-3xl font-semibold mb-2">Family Group</h2>
            {localRequests?.length > 0 && (
              <IconButton onClick={handleNotifications}>
                <Badge
                  badgeContent={localRequests?.length}
                  color="error"
                  overlap="circular"
                  sx={{ "& .MuiBadge-badge": { fontSize: 18 } }}
                >
                  <NotificationsIcon fontSize="large" />
                </Badge>
              </IconButton>
            )}
          </div>

          {localFamilyGroup.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
              {localFamilyGroup.map((family) => (
                <li
                  key={family.family_id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/family/${family.family_id}`}
                      className="text-lg font-semibold text-dark hover:underline"
                    >
                      {family.family_name}
                    </Link>
                    {editFamily && (
                      <div>
                        <IconButton
                          onClick={() => {
                            setEditReady(!editReady);
                            setFamilyName(family.family_name);
                            setFamilyId(family.family_id);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleLeaveFamily(family.family_id)}
                        >
                          <ExitToAppIcon />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No family group found.</p>
          )}
        </section>{" "}
      </div>

      {notificationsModal && (
        <div
          className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setNotificationsModal(!notificationsModal)}
        >
          <div
            className="bg-white relative p-6 rounded-lg shadow-lg w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Notifications</h3>
              <IconButton
                onClick={() => setNotificationsModal(!notificationsModal)}
                size="large"
              >
                <CloseIcon fontSize="medium" />
              </IconButton>
            </div>

            <ul>
              {localRequests.map((request) => (
                <li
                  key={request.request_id}
                  className="mb-2 flex justify-between items-center shadow-lg bg-gray-100 rounded-lg p-6"
                >
                  <span>{request.message}</span>
                  <div>
                    <button
                      className="bg-green-500 hover:bg-green-700 min-w-24 mb-4 text-white px-2 py-1 rounded mr-2"
                      onClick={() =>
                        handleApproval(request.request_id, "approve")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 min-w-24 text-white px-2 py-1 rounded"
                      onClick={() => handleApproval(request.request_id, "deny")}
                    >
                      Deny
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {(newFamily || editReady) && (
        <div
          className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            if (editReady) {
              setEditReady(!editReady);
            } else {
              setNewFamily(!newFamily);
            }
            setFamilyName("");
          }}
        >
          <div
            className="bg-white relative p-6 rounded-lg shadow-lg w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">
                {editReady ? "Edit Family Group" : "New Family Group"}
              </h3>
              <IconButton
                onClick={() => {
                  if (editReady) {
                    setEditReady(!editReady);
                  } else {
                    setNewFamily(!newFamily);
                  }
                  setFamilyName("");
                }}
                size="large"
              >
                <CloseIcon fontSize="medium" />
              </IconButton>
            </div>

            <form onSubmit={handleFamilySubmit}>
              <div className="mb-4">
                <label
                  htmlFor="familyName"
                  className="block text-md font-semibold"
                >
                  Family Name
                </label>
                <input
                  type="text"
                  id="familyName"
                  name="familyName"
                  value={familyName}
                  required
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div id="status-error" aria-live="polite" aria-atomic="true">
                {familyState.errors &&
                  Object.entries(familyState.errors).map(([field, errors]) => (
                    <div key={field}>
                      {errors &&
                        errors.map((error, index) => {
                          return (
                            <p
                              key={`${error}-${index}`}
                              className="mt-2 text-sm text-red-500"
                            >
                              {error}
                            </p>
                          );
                        })}
                    </div>
                  ))}
              </div>

              <div className="flex justify-end">
                <Button variant="contained" color="primary" type="submit">
                  {editReady ? "Save" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {joinFamily && (
        <div
          className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setJoinFamily(!joinFamily)}
        >
          <div
            className="bg-white relative p-6 rounded-lg shadow-lg w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">{"Join Family Group"}</h3>
              <IconButton
                onClick={() => setJoinFamily(!joinFamily)}
                size="large"
              >
                <CloseIcon fontSize="medium" />
              </IconButton>
            </div>

            <form onSubmit={handleJoinSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="familyName"
                  className="block text-md font-semibold"
                >
                  Family Name
                </label>
                <input
                  type="text"
                  id="familyName"
                  name="familyName"
                  value={familyName}
                  required
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="recipientEmail"
                  className="block text-md font-semibold"
                >
                  Recipient Email
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  name="recipientEmail"
                  value={recipientEmail}
                  required
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div id="status-error" aria-live="polite" aria-atomic="true">
                {joinState.errors &&
                  Object.entries(joinState.errors).map(([field, errors]) => (
                    <div key={field}>
                      {errors &&
                        errors.map((error, index) => {
                          return (
                            <p
                              key={`${error}-${index}`}
                              className="mt-2 text-sm text-red-500"
                            >
                              {error}
                            </p>
                          );
                        })}
                    </div>
                  ))}
              </div>

              <div className="flex justify-end">
                <Button variant="contained" color="primary" type="submit">
                  Send Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FamilyGroup;