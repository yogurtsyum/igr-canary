local groupId = 123;
local requiredRank = 255;
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
	player.Chatted:connect(function(msg)
		local args = msg:split(" ")
		if args[1] == "!setrank" then
			local user = args[2]
			local rank = slice(args, 3)
			rank = table.concat(rank, ' ')
			if(user and rank) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:GetAsync(server..'setrank?user='..user..'&rank='..rank..'&key='..key..'&author='..player.Name)
				end
			end
		elseif args[1] == "!promote" then
			local user = args[2]
			if(user) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:GetAsync(server..'promote?user='..user..'&key='..key..'&author='..player.Namey)
				end
			end
		elseif args[1] == "!demote" then
			local user = args[2]
			if(user) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:GetAsync(server..'demote?user='..user..'&key='..key..'&author='..player.Name)
				end
			end
		elseif args[1] == "!fire" then
			local user = args[2]
			if(user) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:GetAsync(server..'fire?user='..user..'&key='..key..'&author='..player.Name)
				end
			end
		elseif args[1] == "!shout" then
			msg = table.concat(args, ' ')
			if(player:GetRankInGroup(groupId) >= requiredRank) then
				local res = HttpService:GetAsync(server..'shout?msg='..msg..'&key='..key..'&author='..player.Name)
			end
		end
	end)
end)
