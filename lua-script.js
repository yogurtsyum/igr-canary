print('Loaded commands')

local groupId = 3281575;
local requiredRank = 255;
local maxRank = 255;
local server = 'URL'
local HttpService = game:GetService('HttpService')
local key = 'key'

function slice(tbl, first, last, step)
  local sliced = {}

  for i = first or 1, last or #tbl, step or 1 do
    sliced[#sliced+1] = tbl[i]
  end

  return sliced
end

game.Players.PlayerAdded:connect(function(player)
	print('binding chat')
	player.Chatted:connect(function(msg)
		local args = msg:split(" ")
		if args[1] == "setrank" then
			print('setrank running')
			local user = args[2]
			local rank = slice(args, 3)
			rank = table.concat(rank, ' ')
			if(user and rank) then
				print('passed argument check')
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					print('passed rank check')
					local res = HttpService:GetAsync(server..'setrank?user='..user..'&rank='..rank..'&key='..key..'&author='..player.Name)
					print(res);
					print('all done')
				end
			end
		elseif args[1] == "promote" then
			print('promote running')
			local user = args[2]
			if(user) then
				print('passed argument check')
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					print('passed rank check')
					print(server..'setrank?user='..user..'&key'..key)
					local res = HttpService:GetAsync(server..'promote?user='..user..'&key='..key..'&author='..player.Namey)
					print(res);
					print('all done')
				end
			end
		elseif args[1] == "demote" then
			print('demote running')
			local user = args[2]
			if(user) then
				print('passed argument check')
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					print('passed rank check')
					print(server..'setrank?user='..user..'&key'..key)
					local res = HttpService:GetAsync(server..'demote?user='..user..'&key='..key..'&author='..player.Name)
					print(res);
					print('all done')
				end
			end
		elseif args[1] == "fire" then
			print('fire running')
			local user = args[2]
			if(user) then
				print('passed argument check')
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					print('passed rank check')
					local res = HttpService:GetAsync(server..'fire?user='..user..'&key='..key..'&author='..player.Name)
					print(res);
					print('all done')
				end
			end
		elseif args[1] == "shout" then
			print('shout running')
			msg = table.concat(args, ' ')
			print('passed argument check')
			if(player:GetRankInGroup(groupId) >= requiredRank) then
				print('passed rank check')
				print(server..'shout?msg='..user)
				local res = HttpService:GetAsync(server..'shout?msg='..msg..'&key='..key..'&author='..player.Name)
				print(res);
				print('all done')
			end
		end
	end)
end)
