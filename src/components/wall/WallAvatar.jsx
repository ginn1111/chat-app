import React, { memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UilUserExclamation,
  UilUserCheck,
  UilUserPlus,
  UilUserMinus,
  UilUserTimes,
  UilCameraPlus,
  UilCheck,
  UilTimes,
} from '@iconscout/react-unicons';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import FriendState from './FriendState';
import { getFriendStatus, getStatus } from '../../store/selectors';
import {
  updateAvatar,
  resetStatus as userResetStatus,
  updateCoverPicture,
} from '../../store/authen-slice';
import {
  sendAddFriend,
  responseAddFriend,
  resetStatus,
  unfriend,
} from '../../store/friend-slice';
import withToast from '../../hoc/withToast';
import { convertImageToBase64 } from '../../utils/helper';

const WallAvatar = withToast(
  ({
    fullName,
    avatar,
    isOwned,
    isFriend,
    isPending,
    isResponse,
    coverPicture,
    toast,
  }) => {
    const dispatch = useDispatch();
    const param = useParams();
    const status = useSelector(getFriendStatus);
    const userStatus = useSelector(getStatus);

    const [isUpdateAvatar, setIsUpdateAvatar] = useState(false);
    const [bgUrl, setBgUrl] = useState(null);
    const [bgSrc, setBgSrc] = useState(null);

    const avatarRef = useRef();

    const updateAnimate = {
      exit: { x: -10, opacity: 0 },
      initial: { x: -10, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.3 },
      whileHover: { scale: 1.3 },
    };
    const errorType = { color: 'salmon' };
    const warningType = { color: '#ffb100cf' };
    const safeType = { color: '#50f350' };

    useEffect(() => {
      if (status === 'send-add-friend/success') {
        toast.addToast({ message: 'Send request successfully!' });
        dispatch(resetStatus());
      }
      if (status === 'send-add-friend/failed') {
        toast.addToast({
          message: 'Send request failed, try again!',
          type: 'error',
        });
        dispatch(resetStatus());
      }
      if (status === 'unfriend/success') {
        toast.addToast({
          message: 'Unfriend successfully!',
        });
        dispatch(resetStatus());
      }
      if (status === 'unfriend/failed') {
        toast.addToast({
          message: 'Unfriend failed, something went wrong!',
          type: 'error',
        });
        dispatch(resetStatus());
      }
    }, [status, dispatch, toast]);

    useEffect(() => {
      if (userStatus === 'update-avatar/success') {
        toast.addToast({ message: 'Change avatar successfully!' });
        dispatch(userResetStatus());
      }
      if (userStatus === 'update-avatar/failed') {
        toast.addToast({
          message: 'Change avatar failed, something went wrong!',
          type: 'error',
        });
        dispatch(userResetStatus());
      }
      if (userStatus === 'update-background/success') {
        toast.addToast({ message: 'Change background successfully!' });
        dispatch(userResetStatus());
      }
      if (userStatus === 'update-background/failed') {
        toast.addToast({
          message: 'Change background failed, something went wrong!',
          type: 'error',
        });
        dispatch(userResetStatus());
      }
    }, [userStatus, dispatch, toast]);

    function sendAddFriendHandler() {
      dispatch(sendAddFriend(param.id));
    }

    function responseAddFriendHandler(isAccepted) {
      dispatch(
        responseAddFriend({ receiverId: param.id, accepted: isAccepted }),
      );
    }

    function unfriendHandler() {
      dispatch(unfriend(param.id));
    }

    function clickFileInputHandler(e) {
      // handle not change file when choose one file twice
      e.target.value = '';
    }

    useEffect(() => {
      if (bgSrc) {
        setBgUrl(URL.createObjectURL(bgSrc));
        return () => URL.revokeObjectURL(bgSrc);
      }
    }, [bgSrc]);

    function changeAvatarHandler(e) {
      e.target.files?.length > 0 &&
        convertImageToBase64(e.target.files[0], (reader) => {
          const base64Code = reader.target.result;
          avatarRef.current.src = base64Code;
          setIsUpdateAvatar(true);
        });
    }

    function changeBackgroundHandler(e) {
      e.target.files[0] && setBgSrc(e.target.files[0]);
    }

    function cancelUpdateBackgroundHandler() {
      setBgUrl(coverPicture);
      setBgSrc(null);
    }

    function updateBackgroundHandler() {
      convertImageToBase64(bgSrc, (reader) => {
        const base64Code = reader.target.result;
        dispatch(updateCoverPicture(base64Code));
      });
      setBgSrc(null);
    }

    function cancelUpdateAvatarHandler() {
      avatarRef.current.src = avatar;
      setIsUpdateAvatar(false);
    }

    function updateAvatarHandler() {
      dispatch(updateAvatar(avatarRef.current.src));
      setIsUpdateAvatar(false);
    }

    return (
      <section
        className={`w-5/6 relative rounded-b-lg pt-[25%] `}
        style={{
          backgroundImage: `url('${bgUrl ?? coverPicture}')`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="bottom-0 absolute-x-center translate-y-[50%] w-[120px] h-max">
          <div className="  relative ">
            <img
              ref={avatarRef}
              src={avatar}
              alt="avatar"
              className="w-[120px] h-[120px] duration-300 rounded-full object-cover object-center shadow-[0_0_0_5px_#ffffff]"
            />
            {isOwned && (
              <motion.div
                whileInView={{
                  translateX: isUpdateAvatar ? '60%' : '0%',
                  transition: { duration: 0.3 },
                }}
                className="absolute bottom-0 right-0  text-slate-600 bg-white shadow-md  flex justify-center items-center  rounded-full"
              >
                <label
                  htmlFor="change-avatar"
                  className="cursor-pointer p-[8px] "
                >
                  <UilCameraPlus size="22" />
                </label>
                <input
                  onClick={clickFileInputHandler}
                  onChange={changeAvatarHandler}
                  accept="image/*"
                  type="file"
                  id="change-avatar"
                  className="hidden outline-none border-none"
                />{' '}
                <AnimatePresence>
                  {isUpdateAvatar && (
                    <motion.div
                      className="p-[8px] cursor-pointer"
                      {...updateAnimate}
                      onClick={updateAvatarHandler}
                    >
                      <UilCheck size="22" color="lightgreen" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isUpdateAvatar && (
                    <motion.div
                      onClick={cancelUpdateAvatarHandler}
                      className="p-[8px] cursor-pointer"
                      {...updateAnimate}
                    >
                      <UilTimes size="22" color="lightcoral" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
        <div className="absolute right-2 bottom-2 flex items-center gap-x-2">
          {isOwned && (
            <div className=" bg-white flex cursor-pointer items-center w-max overflow-hidden px-2  rounded-md  py-1.5">
              <label
                htmlFor="change-bg"
                className="text-slate-600 flex items-center cursor-pointer text-[14px] font-bold  gap-x-1.5"
              >
                <motion.div {...updateAnimate}>
                  <CameraAltOutlinedIcon sx={{ fontSize: 23 }} />
                </motion.div>
              </label>
              <AnimatePresence>
                {bgSrc && (
                  <motion.div
                    onClick={updateBackgroundHandler}
                    className="px-1"
                    {...updateAnimate}
                  >
                    <UilCheck color="lightgreen" size="22" />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {bgSrc && (
                  <motion.div
                    onClick={cancelUpdateBackgroundHandler}
                    {...updateAnimate}
                  >
                    <UilTimes color="lightcoral" size="22" />
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                onClick={clickFileInputHandler}
                onChange={changeBackgroundHandler}
                accept="image/*"
                type="file"
                id="change-bg"
                className="hidden outline-none border-none"
              />
            </div>
          )}
          {!isOwned && !isFriend && !isPending && !isResponse && (
            <div onClick={sendAddFriendHandler}>
              <FriendState
                icon={<UilUserPlus style={{ color: '#6fdeff' }} />}
                title="K???t b???n"
              />
            </div>
          )}
          {isPending && !isFriend && (
            <FriendState
              icon={<UilUserExclamation style={warningType} />}
              title="??ang quy???t ?????nh"
            />
          )}
          {isFriend && !isResponse && (
            <div onClick={unfriendHandler}>
              <FriendState
                icon={<UilUserMinus style={errorType} />}
                title="Hu??? k???t b???n"
              />
            </div>
          )}
          {isResponse && (
            <>
              <div onClick={() => responseAddFriendHandler(true)}>
                <FriendState
                  icon={<UilUserCheck style={safeType} />}
                  title="Ch???p nh???n"
                />
              </div>
              <div onClick={() => responseAddFriendHandler(false)}>
                <FriendState
                  icon={<UilUserTimes style={errorType} />}
                  title="T??? ch???i"
                />
              </div>
            </>
          )}
        </div>
        <span className="text-[20px] w-full block text-slate-600 absolute-x-center bottom-[-100px] font-[500] text-center">
          {fullName}
        </span>
      </section>
    );
  },
);

export default memo(WallAvatar);
