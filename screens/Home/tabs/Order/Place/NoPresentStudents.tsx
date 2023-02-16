import { View, Text } from 'react-native';
import React from 'react';

const NoPresentStudents = () => {
    return (
        <Text className="m-auto mb-4 font-{poppins} font-bold text-red-400">
            No students present :(
        </Text>
    );
};

export default NoPresentStudents;
