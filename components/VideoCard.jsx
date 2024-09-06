import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import CustomButton from "./CustomButton";
import { deletePosts } from "../lib/appwrite";
import { router } from "expo-router";

const VideoCard = ({
  title,
  creator,
  avatar,
  thumbnail,
  video,
  profile,
  postId,
  onPostDeleted,
}) => {
  const [play, setPlay] = useState(false);
  const { user } = useGlobalContext();

  const deletePost = async () => {
    try {
      console.log(postId);
      await deletePosts(postId);
      if (onPostDeleted) onPostDeleted();
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error(error);
    }
  };
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator.username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {profile && user?.$id === creator?.$id && (
        <View className="w-full justify-evenly items-end flex-row  ">
          <CustomButton
            title="delete"
            containerStyles="w-[100px] mt-10 min-h-[30px] rounded-lg bg-red-500 "
            textStyles="text-white"
            handlePress={deletePost}
          />
        </View>
      )}
    </View>
  );
};

export default VideoCard;
