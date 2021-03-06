import React from 'react';
import { Box, Text, Skeleton, Flex, Divider } from '@chakra-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { departmentOptions } from 'utils/constants';
import { EditableText, EditableSelect } from 'components/Editable';
import { useUserRoles, Roles } from 'hooks/users';
import { getCurrentUser, updateCurrentUser } from './slice';
import Card from 'components/Card';
import DeptBadge from 'components/DeptBadge';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const profile = useSelector(getCurrentUser);

  const isAuthorised = useUserRoles([Roles.ADMIN, Roles.DEPT_HEAD]);

  const updateUsername = (value: string) => {
    dispatch(updateCurrentUser({ key: 'username', value }));
  };

  const updateDepartment = (value: any) => {
    dispatch(
      updateCurrentUser({
        key: 'department',
        value: { previousId: profile.user?.departments?.[0]?.department_id, nextId: value },
      })
    );
  };

  return (
    <Box>
      <Card py={2} boxShadow="none" borderRadius={4} border="1px solid #E2E8F0">
        <Box minHeight="58px">
          <Text fontSize="0.8em" fontWeight={500} color="gray.500">
            Username
          </Text>
          <Skeleton isLoaded={!profile.isLoading}>
            <EditableText defaultValue={profile.user?.username} onSubmit={updateUsername} />
          </Skeleton>
        </Box>
        <Divider mt={0} />
        <Box minHeight="58px">
          <Text fontSize="0.8em" fontWeight={500} color="gray.500">
            Email
          </Text>
          <Skeleton isLoaded={!profile.isLoading}>
            <Text>{profile.user?.email}</Text>
          </Skeleton>
        </Box>
        <Divider mt={0} />
        <Box minHeight="58px">
          <Text fontSize="0.8em" fontWeight={500} color="gray.500">
            Department
          </Text>
          <Skeleton isLoaded={!profile.isLoading}>
            <EditableSelect
              defaultValue={profile.user?.departments?.[0]?.department_name}
              options={departmentOptions}
              onSubmit={updateDepartment}
              component={() => (
                <DeptBadge
                  department={profile.user?.departments?.[0]?.department_name}
                  m="2px auto 0 0"
                />
              )}
            />
          </Skeleton>
        </Box>
        <Divider mt={0} />
        {isAuthorised && (
          <Box minHeight="58px">
            <Text fontSize="0.8em" fontWeight={500} color="gray.500">
              Roles
            </Text>
            <Skeleton isLoaded={!profile.isLoading}>
              <Flex>
                {profile.user?.roles?.map((role) => (
                  <DeptBadge key={role.role_id} department={role.role_name} m="2px 8px 0 0" />
                ))}
              </Flex>
            </Skeleton>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default UserProfile;
